import { supabase } from "../utils/supabaseClient";

export const getCar = async () => {
    const { data, error } = await supabase
        .from('cars')
        .select('*');

    if (error) throw error;
    return data;
}

export const getCarByUserId = async (userId) => {
    const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', userId);

    if (error) throw error;
    return data;
}

export const getCarById = async (id) => {
    const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export const addCar = async (carData) => {
    const { data, error } = await supabase
        .from('cars')
        .insert([carData]);

    if (error) throw error;
    return data;
}

export const updateCar = async (id, carData) => {
    const { data, error } = await supabase
        .from('cars')
        .update(carData)
        .eq('id', id);

    if (error) throw error;
    return data;
}

export const deleteCar = async (id) => {
    const { data, error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return data;
}