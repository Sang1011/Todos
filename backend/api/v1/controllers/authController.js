const bcrypt = require('bcrypt');
const User = require('./models/User'); 

const register = async (req, res) => {
    const { username, email, password } = req.body;

    // Kiểm tra nếu người dùng đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: savedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err });
    }
};
