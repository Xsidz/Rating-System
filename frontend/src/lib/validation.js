
export const validateName = (name) => {
    if (!name || typeof name !== 'string') {
        return { isValid: false, error: 'Name is required' };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 20) {
        return { isValid: false, error: 'Name must be at least 20 characters long' };
    }

    if (trimmedName.length > 60) {
        return { isValid: false, error: 'Name must not exceed 60 characters' };
    }

    return { isValid: true, error: '' };
};


export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: 'Email is required' };
    }

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true, error: '' };
};


export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters long' };
    }

    if (password.length > 16) {
        return { isValid: false, error: 'Password must not exceed 16 characters' };
    }

    const hasUppercase = /[A-Z]/.test(password);
    if (!hasUppercase) {
        return { isValid: false, error: 'Password must contain at least one uppercase letter' };
    }

    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    if (!hasSpecialChar) {
        return { isValid: false, error: 'Password must contain at least one special character' };
    }

    return { isValid: true, error: '' };
};


export const validateAddress = (address) => {
    if (!address || typeof address !== 'string') {
        return { isValid: false, error: 'Address is required' };
    }

    const trimmedAddress = address.trim();

    if (trimmedAddress.length === 0) {
        return { isValid: false, error: 'Address is required' };
    }

    if (trimmedAddress.length > 400) {
        return { isValid: false, error: 'Address must not exceed 400 characters' };
    }

    return { isValid: true, error: '' };
};


export const validateForm = (formData) => {
    const errors = {};
    let isValid = true;

    if (formData.name !== undefined) {
        const nameValidation = validateName(formData.name);
        if (!nameValidation.isValid) {
            errors.name = nameValidation.error;
            isValid = false;
        }
    }

    if (formData.email !== undefined) {
        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.isValid) {
            errors.email = emailValidation.error;
            isValid = false;
        }
    }

    if (formData.password !== undefined) {
        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            errors.password = passwordValidation.error;
            isValid = false;
        }
    }

    if (formData.address !== undefined) {
        const addressValidation = validateAddress(formData.address);
        if (!addressValidation.isValid) {
            errors.address = addressValidation.error;
            isValid = false;
        }
    }

    return { isValid, errors };
};