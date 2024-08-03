const getToken = require('../helpers/get-a-token');
const getUserByToken = require('../helpers/get-user-bytoken');
const Pet = require('../models/Pet');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongoose').Types;


module.exports = class PetController {

    static async create(req, res) {

        const id = req.params.id;

        const images = req.files;


        const { name, age, weight, color } = req.body;
        
        if(!name) {
            res.status(422).json({message: "Name's required"});
        }


        if(!age){
            res.status(422).json({message: " Age's required "});
        }

        if(!weight){
            res.status(422).json({message: " Weight's required "});
        }

        if(!color){
            res.status(422).json({message: " Color's required "});
        }


        if(images.length === 0) {
            res.status(422).json({message: " Image's required "});
        }

        let available = true;        

        const user = await User.findById(id);

        if(!user){
            res.status(422).json({message: " User not found "});
        }

        
        const pet = new Pet({    

            name, 
            age, 
            weight, 
            color,
            available,
            images: [],
            user: {
                _id: user.id,
                name: user.name,
                image: user.image,
                phone: user.phone   

            }
            
        });


        images.map((image) => {
            pet.images.push(image.filename);
        });

        try {

            const newPewt = await pet.save();

            res.status(200).json({
                message: "Pet cadastro",
                newPewt,
            });

        } catch (error) {
            res.status(500).json({message: "Erro informado ->", error});
            
        }

    }

    static async getALL(req, res) {

        const pets = await Pet.find().sort('-createdAt');

        if(!pets){
            res.status(422).json({message: " Error, doesn't exist any Pet logged"});
        }

        res.status(200).json({
            pets: pets
        });

    }
 
    // This function should receive `req` and `res` as parameters

    static async getAllUserPets(req, res) {

        try {

            const id = req.params.id;

            
            // Find user by ID
            const user = await User.findById(id);
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
    
            // Find pets by user ID
            const pets = await Pet.find({ 'user._id': id }).sort('-createdAt');

            if (!pets || pets.length === 0) {
                return res.status(422).json({ message: "Error, no pets logged for this user" });
            }
    
            // Respond with pets
            res.status(200).json({ pets });

        } catch (error) {
            // Error handling
            res.status(500).json({ message: error.message });
        }
    
    }


static async getUserAdoptions(req, res) {
    try {
        const id = req.params.id;
        
        // Find user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find pets by adopter ID
        const pets = await Pet.find({ 'adopter._id': new ObjectId(id) });

        if (!pets || pets.length === 0) {
            return res.status(422).json({ message: "Error, no pets logged for this user" });
        }

        // Respond with pets
        res.status(200).json({ pets });
    } catch (error) {
        // Error handling
        res.status(500).json({ message: error.message });
    }
}

    



 static async getPetById(req, res) {

        const id = req.params.id;

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: "Invalid Id!"});
            return;
        }

        const pet = await Pet.findOne({_id: id});


        if(!pet) {
            res.status(422).json({message: "Pet not found"});
            return;
        }


        res.status(200).json({
            pet,
        });


    }

    static async deletePetById(req, res) {

        const id = req.params.id;
    
        if (!ObjectId.isValid(id)) {
            res.status(422).json({ message: "Invalid Id!" });
            return;
        }
    
        try {
            // Check pet exists
            const pet = await Pet.findOne({ _id: id });
    
            if (!pet) {
                res.status(422).json({ message: "Pet not found" });
                return;
            }
    
            // Check if logged in user registered in pet
            const user = req.user;  // Assuming user is set in req by middleware
    
            if (pet.user._id.toString() !== user.id.toString()) {
                res.status(422).json({ message: "User not authenticated to remove" });
                return;
            }
    
            await Pet.findByIdAndDelete(id);

            res.status(200).json({ message: "Pet deleted!" });
            
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    
    static async updatedPet(req, res) {
        
        const id = req.params.id;
        
        const { name, age, weight, color } = req.body;

    
        // Verifica se o ID é válido
        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "Invalid Id!" });
        }
    
        try {
            // Verifica se o pet existe
            const pet = await Pet.findOne({ _id: id });
    
            if (!pet) {
                return res.status(422).json({ message: "Pet not found" });
            }


            // Verifica se o usuário logado registrou o pet
            const user = req.user; // Assumindo que o usuário está definido no req por middleware
    
            if (pet.user._id.toString() !== user.id.toString()) {
                return res.status(403).json({ message: "User not authenticated to update" });
            }
    
            // Verifica e atualiza os campos
            const updatedPet = {};
            if (name) updatedPet.name = name;
            if (age) updatedPet.age = age;
            if (weight) updatedPet.weight = weight;
            if (color) updatedPet.color = color;


            const images = req.files;

            // Verifica e atualiza as imagens
            if (images && images.length > 0) {

                updatedPet.images = [];

                images.map((img) => updatedPet.images.push(img.filename));
            } 

            // Atualiza o pet no servidor
            const result = await Pet.findByIdAndUpdate(new ObjectId(id), updatedPet, { new: true });
    
            if (!result) {
                return res.status(500).json({ message: "Failed to update pet." });
            }
            return res.status(200).json({ message: "Pet updated!", pet: result });
        } catch (error) {
            console.error(error); // Isso vai imprimir o erro no console para depuração
            return res.status(500).json({ message: "An error occurred while updating the pet.", error: error.message });
        }
    }


static async schedule(req, res) {
    const id = req.params.id;

    // Verifica se o ID é válido
    if (!ObjectId.isValid(id)) {
        return res.status(422).json({ message: "Invalid Id!" });
    }

    try {
        const pet = await Pet.findOne({ _id: new ObjectId(id) });

        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }


        const token = getToken(req);
        const user = await getUserByToken(token);

        // Converta ambos os IDs para strings e compare
        if (pet.user._id.toString() === user._id.toString()) {
            return res.status(422).json({
                message: "Você não pode agendar uma visita com o seu próprio Pet"
            });
        }

        if (pet.adopter) {
            if (pet.adopter._id.toString() === user._id.toString()) {
                return res.status(422).json({
                    message: "Você já agendou uma visita com este Pet"
                });
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image,
            phone: user.phone
        };

        await Pet.findByIdAndUpdate(new ObjectId(id), pet, { new: true });

        return res.status(200).json({
            message: `A visita foi agendada, entre em contato com o ${pet.user.name} pelo telefone ${pet.user.phone}`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while scheduling the appointment.",
            error: error.message
        });
    
    
    }
    

    }


    static async concludePet(req, res) {
        const id = req.params.id;



        if (!ObjectId.isValid(id)) {
            return res.status(422).json({ message: "Invalid Id!" });
        }
    
        try {
            const pet = await Pet.findOne({ _id: new ObjectId(id) });
    
            if (!pet) {
                return res.status(404).json({ message: "Pet not found" });
            }
    
    
            const token = getToken(req);
            const user = await getUserByToken(token);
    
            // Converta ambos os IDs para strings e compare
            if (pet.user._id.toString() !== user._id.toString()) {
                return res.status(422).json({
                    message: "You can't schedule an appointment with your own pet."
                });
            }
            pet.available = false

            await Pet.findByIdAndUpdate(new ObjectId(id), pet, { new: true });

            res.status(200).json({message: " Pet adotado com sucesso!!! "})

        }catch(error){
            console.error(error);
            return res.status(500).json({
                message: "Ocorreu um erro no processo de adoção.",
                error: error.message
            });
        }
    


    }



}