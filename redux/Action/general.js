import { types } from "./actionTypes";
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function requestInit(user) {
    return {
        type: types.REQUEST_INIT,
        payload: {
            userAuth: user != null ? 1 : 0,
        }
    };
}

export function successInt(navigateScreen) {
    return {
        type: types.SUCCESS_INIT,
        payload: {
            navigateScreen
        }
    };
}

export function addToCart(id, quantity) {
    return {
        type: types.ADD_TO_CART,
        payload: {
            id,
            quantity
        }
    };
}

export function addToWishList(data) {
    return {
        type: types.ADD_TO_WISHLIST,
        payload: {
            data
        }
    };
}
export function getHomeRequest() {
    return {
        type: types.GET_HOME_REQUEST,
    };
}

export function getHomeSuccess(data) {
    return {
        type: types.GET_HOME_SUCCESS,
        payload: {
            data
        }
    };
}

export function getProductDetailsRequest() {
    return {
        type: types.GET_PRODUCT_DETAILS_REQUEST,
    };
}

export function getProductDetailsSuccess(data) {
    return {
        type: types.GET_PRODUCT_DETAILS_SUCCESS,
        payload: {
            data
        }
    };
}


export function successCart(data) {
    return {
        type: types.SUCCESS_CART,
        payload: {
            cartData: data
        }
    };
}

export function successWishlist(data) {
    return {
        type: types.SUCCESS_WISHLIST,
        payload: {
            wishlistData: data
        }
    };
}


export function removeFromCart(id) {
    return {
        type: types.REMOVE_CART,
        payload: {
            id
        }
    };
}


export function decrementQuantity(id) {
    return {
        type: types.DEREMENT_QUANTITY,
        payload: {
            id
        }
    };
}


export function incrementQuantity(id) {
    return {
        type: types.INCREMENT_QUANTITY,
        payload: {
            id
        }
    };
}

export function proceedCheckout() {
    return {
        type: types.PROCEED_CHECKOUT,
        payload: {

        }
    };
}

export function successCheckout() {
    return {
        type: types.SUCCESS_CHECKOUT,
        payload: {
        }
    };
}

export function authStatus(status) {
    return {
        type: types.AUTH_STATUS,
        payload: {
            status: status
        }
    }
}

export function doLogin(data) {
    return {
        type: types.DO_LOGIN,
        payload: {
            data
        }
    }
}

export function doLogout() {
    return {
        type: types.DO_LOGOUT,
        payload: {

        }
    }
}