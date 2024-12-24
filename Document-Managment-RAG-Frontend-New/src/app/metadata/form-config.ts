export const formConfig = {
    signup: {
        title: 'Create Your Account',
        fields: [
            { name: 'username', type: 'text', label: 'Username', required: true },
            { name: 'name', type: 'text', label: 'Name', required: true },
            { name: 'email', type: 'email', label: 'Email', required: true },
            { name: 'password', type: 'password', label: 'Password', required: true },
            { name: 'passwordConfirm', type: 'password', label: 'Confirm Password', required: true }
        ]
    },
    login: {
        title: 'Sign In',
        fields: [
            { name: 'email', type: 'email', label: 'Email', required: true },
            { name: 'password', type: 'password', label: 'Password', required: true }
        ]
    }
};
