const { supabase } = require('../config/supabase');

const bookingsService = {
  create: async (userId, userEmail, userName, bookingData) => {
    const { missionId, destination, cabinClass, passengerId, specialRequirements } = bookingData;
    
    const { data, error } = await supabase.rpc('create_booking_v1', {
      p_user_id: userId,
      p_user_name: userName,
      p_user_email: userEmail,
      p_mission_id: missionId,
      p_destination: destination,
      p_cabin_class: cabinClass,
      p_passenger_id: passengerId,
      p_special_requirements: specialRequirements || ''
    });

    if (error) {
      const statusCode = error.message.includes('not found') ? 404 : 
                        error.message.includes('already full') ? 400 :
                        error.message.includes('already have an active booking') ? 409 : 400;
      throw { statusCode, message: error.message };
    }

    // Fetch the full booking object to return
    const { data: booking } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', data.booking_id)
      .single();

    return { booking };
  },

  getByUserId: async (uid) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('uid', uid)
      .order('booked_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  cancel: async (bookingId, userId) => {
    // In a real app, this should also be an RPC to return seats to mission
    // For simplicity, we'll do it in two steps (not recommended for production but okay here)
    
    const { data: booking, error: getError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (getError || !booking) throw { statusCode: 404, message: 'Booking not found' };
    if (booking.uid !== userId) throw { statusCode: 403, message: 'Unauthorized' };
    if (booking.booking_status === 'Cancelled') throw { statusCode: 400, message: 'Already cancelled' };

    const { error: updateError } = await supabase
      .from('bookings')
      .update({ booking_status: 'Cancelled', cancelled_at: new Date() })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    // Return seat to mission
    await supabase.rpc('increment_mission_seats', { p_mission_id: booking.mission_id });

    return { ...booking, booking_status: 'Cancelled' };
  },

  getAll: async (filters = {}) => {
    let query = supabase.from('bookings').select('*');
    if (filters.status) query = query.eq('booking_status', filters.status);
    if (filters.missionId) query = query.eq('mission_id', filters.missionId);
    if (filters.uid) query = query.eq('uid', filters.uid);

    const { data, error } = await query.order('booked_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

module.exports = bookingsService;
