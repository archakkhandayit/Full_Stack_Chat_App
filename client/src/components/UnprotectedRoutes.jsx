import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UnprotectedRoutes = ({children}) => {

    const { isAuthenticated } = useSelector(state => state.userReducer);
    const navigate = useNavigate();
    useEffect(() => {
        if(isAuthenticated){
            navigate("/");
        }
    }, [isAuthenticated]);
    return (
        children
    );
};

export default UnprotectedRoutes;