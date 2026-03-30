const { supabase } = require('../config/supabase');

const missionsService = {
  getAll: async (filters = {}) => {
    let query = supabase.from('missions').select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    const { data, error } = await query.order('departure', { ascending: true });
    if (error) throw error;
    return data;
  },

  getActive: async () => {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .neq('status', 'Full')
      .order('status', { ascending: true })
      .order('departure', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  },

  update: async (id, data) => {
    const { data: updated, error } = await supabase
      .from('missions')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated;
  }
};

module.exports = missionsService;
