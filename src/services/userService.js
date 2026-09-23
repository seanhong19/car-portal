import { supabase } from "../utils/supabaseClient";

export const getUsers = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) throw error
    return data;
}

export const getUserById = async (id) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error
    return data;
}
export const getUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

    if (error) throw error
    return data;
}

export const addUser = async (userData) => {
    const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                first_name: userData.firstName,
                last_name: userData.lastName,
                username: userData.username
            }
        }
    })

    if (error) throw error;
    return data;
}

export const updateUser = async (id, userData) => {
    const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', id);

    if (error) throw error
    return data;
}