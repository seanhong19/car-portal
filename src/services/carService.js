import { supabase } from "../utils/supabaseClient";

export const getCar = async () => {
    return await supabase
        .from('cars')
        .select('*');
}

export const getCarByUserId = async (userId) => {
    return await supabase
        .from('cars')
        .select('*')
        .eq('user_id', userId);
}

export const getCarById = async (id) => {
    return await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();
}

export const addCar = async (carData) => {
    return await supabase
        .from('cars')
        .insert([carData]);
}

export const updateCar = async (id, carData) => {
    return await supabase
        .from('cars')
        .update(carData)
        .eq('id', id);
}

export const deleteCar = async (id) => {
    return await supabase
        .from('cars')
        .delete()
        .eq('id', id);
}