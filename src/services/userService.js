import { supabase } from "../utils/supabaseClient";

export const getUsers = async (id) => {
    return await supabase
        .from('profiles')
        .select('*');
}

export const getUserById = async (id) => {
    return await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
}
export const getUserByEmail = async (email) => {

}
export const addUser = (userData) => API.post("/users", userData);

export const updateUser = async (id, userData) => {
    return await supabase
        .from('profiles')
        .update(userData)
        .eq('id', id);
}