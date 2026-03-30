const { supabase } = require('../config/supabase');

const usersService = {
  getByUid: async (uid) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  create: async (userData) => {
    const { uid, name, username, email } = userData;
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        { id: uid, full_name: name, username: username, updated_at: new Date() }
      ])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (uid, data) => {
    const { data: updatedData, error } = await supabase
      .from('profiles')
      .update({ ...data, updated_at: new Date() })
      .eq('id', uid)
      .select()
      .single();
    if (error) throw error;
    return updatedData;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return data;
  }
};

module.exports = usersService;
