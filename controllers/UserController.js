const createUserToken = require('../helpers/create-user-token');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();


// importando os helpers

const tokenId = require('../helpers/get-a-token');
const getUserToken = require('../helpers/get-user-bytoken');

module.exports = class UserController {

    static async register(req, res) {

        console.log(   ' registrando um Usuário no sistema  ');


        const { name, email, phone, password, confirmpassword} = req.body;

        // Validate required fields
        if (!name) {
            res.status(400).json({ message: 'Name is required' });
            return;
        }

        if (!email) {
            res.status(400).json({ message: 'Email is invalid' });
            return;
        }

        if (!phone) {
            res.status(400).json({ message: 'Phone number is invalid' });
            return;
        }

        if (!password) {
            res.status(400).json({ message: 'Crie uma senha ' });
            return;
        }

        if(!confirmpassword) {
            res.status(400).json({ message: 'Não confirmou a senha!'});
            return;
        }

        if(password != confirmpassword) {
            res.status(400).json({ message: 'Senhas não conferem, confirme novamente! ' });
            return;
        }
     

        try {
            // Check if user with the same email already exists
            console.log('Checking if user already exists');

            const existingUser = await User.findOne({email: email});

            if (existingUser) {
                res.status(422).json({ message: 'Email already exists' });
                return;
            }
            

            console.log('Creating new user');
            
            const user = new User({
                name,
                email,
                phone,
                password,
                confirmpassword
            });

            const newUser = await user.save();


           await createUserToken(newUser, req, res);

        } catch (error) {
            res.status(500).json({ message: `Server error: ${error.message}` });
            console.error(error);
        }
    }

    static async data(req, res) {
        
        const id = req.params.id;

        const datas = await User.findById({_id: id});

        if (!datas) {
            res.status(404).json({ message: 'No data found' });
            return;
        }

        res.json(datas);


    }


    static async Login(req, res) {
        const { email, password } = req.body;
    
        // Check if email and password are provided
        if (!email) {
            res.status(422).json({ message: 'Email is required' });
            return;
        }
    
        if (!password) {
            res.status(422).json({ message: 'Password is required' });
            return;
        }
    
        try {
            // Check if user exists
            const user = await User.findOne({ email });

            if (!user) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }
    
            // Check if password is correct
            if(password !== user.password) {
                res.status(422).json({ message: 'Invalid password' });
                // retorna sempre algo pra não da erro no insomnia
                return;
            }

            // Generate and send token
            await createUserToken(user, req, res);
    
        } catch (error) {
            // Handle any unexpected errors
            res.status(500).json({ message: 'An error occurred during login', error: error.message });
        }


    }

    static async checkUser (req, res) {

        const id = req.params.id;

        try {
            // Sua lógica para encontrar o usuário
            const currentUser = await User.findOne({id});
        
            // Verifique se currentUser não é nulo
            if (!currentUser) {
              return res.status(404).json({ message: 'Usuário não encontrado' });
            }
        
            // Remover a senha do objeto do usuário antes de retornar
            currentUser.password = undefined;

            // Retorne a resposta com o usuário encontrado
            return res.status(200).json(currentUser);
        
          } catch (error) {
            console.error('Erro ao verificar o usuário:', error.message);
            return res.status(500).json({ message: 'Erro interno do servidor' });
          }
    }


    static async getUserById(req, res) {

        const id = req.params.id;
        const user = await User.findById(id).select('-password');

        if(!user){
            res.status(422).json({
                message: " User is not found! "
            })

        }

        res.status(200).json({ user });

    }

    static async userUpdate (req, res) {

        const id = req.params.id;

        const token = tokenId(req);

        const user = await getUserToken(token);

        if(!user) {
            res.status(422).json({message: "User has not been found"})
        }


        const { name, email, phone, password, confirmpassword} = req.body;


        if(req.file){
            user.image = req.file.filename;
        }


        if(!name) { 
            res.status(422).json({message: " Nome has not set "});
            return;
        }

        user.name = name;

        // checking if the email already taken.
        const userExists = await User.findOne({email: email});

        if(!email){
            res.status(422).json({message: "Email is required!"});
        }

        if(user.email !== email){
            res.status(422).json({message: "There's a problem with your email"});
            return;
        }

        user.email = email;


        if(!phone){
            res.status(422).json({message: " Phone has not been set "})
        }

        user.phone = phone;

        if(!password){
            res.status(422).json({message: " You has not set your password "})
        }

        if(password !== confirmpassword){
            res.status(422).json({message: " Password is not equal"})
        }

        user.password = password;

        await user.save();
        res.status(200).json({message: " Usuário editado! "});
    
    }

}
