import { call, put, takeEvery } from "redux-saga/effects";
import { types } from "@actions/actionTypes";
import {
    getHomeSuccess, successInt, successCart, successCheckout, authStatus, successWishlist
} from "@actions";
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logfunction, _getLocalCart } from "@helpers/FunctionHelper";
import { getDataService, getUsers, getDataServices} from '../Api/getApi';

export function* watchGeneralRequest() {
    yield takeEvery(types.GET_PRODUCT_DETAILS_REQUEST, getProductDetailsData);
    yield takeEvery(types.GET_HOME_REQUEST, getHomeData);
    yield takeEvery(types.REQUEST_INIT, requestInit);
    yield takeEvery(types.ADD_TO_CART, addToCart);
    yield takeEvery(types.ADD_TO_WISHLIST, addToWishlist);
    yield takeEvery(types.REMOVE_CART, removeFromCart);
    yield takeEvery(types.INCREMENT_QUANTITY, incrementQuantity);
    yield takeEvery(types.DEREMENT_QUANTITY, decrementQuantity);
    yield takeEvery(types.PROCEED_CHECKOUT, proceedCheckout);
    yield takeEvery(types.DO_LOGIN, doLogin);
    yield takeEvery(types.DO_LOGOUT, doLogout);
}

function* requestInit(action) {
    try {

        // ************** If you want to login based home page then do stuff here ****************

        // if (action.payload.userAuth) {
        //     yield put(successInt('HomeScreen'));
        // }
        // else {
        //     yield put(successInt('LoginScreen'));
        // }

        // ************** Else here ****************

        //AsyncStorage.removeItem('IS_AUTH');

        //get local login data
        let getAuth = yield call(AsyncStorage.getItem, "IS_AUTH")
        logfunction("IS LODDED ", getAuth)
        if (getAuth == 1) {
            yield put(authStatus(true));
        }
        else {
            yield put(authStatus(false));
        }

        yield put(successInt('MainScreen'));

        //cart count set
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        logfunction("LOCAL CART  ", JSON.parse(getLocalCart));
        getLocalCart = JSON.parse(getLocalCart);
        if (getLocalCart) {
            yield put(successCart(getLocalCart));
        }

        //Wishlist count set
        let getLocalWishlist = yield call(AsyncStorage.getItem, "GET_LOCAL_WISHLIST");
        logfunction("LOCAL Wishlist  ", JSON.parse(getLocalWishlist));
        getLocalWishlist = JSON.parse(getLocalWishlist);
        if (getLocalWishlist) {
            let wishData = { totalCount: getLocalWishlist.length, wishlistData: getLocalWishlist }
            yield put(successWishlist(wishData));
        }


    } catch (e) {
        logfunction(e)
    }
}

function* addToCart(action) {
    try {
        const { payload } = action;
        logfunction("Payload ==", payload)
        //  
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        logfunction("LOCAL CART  ", JSON.parse(getLocalCart));
        getLocalCart = JSON.parse(getLocalCart);
        if (getLocalCart != null) {
            // let findProduct = getLocalCart.cartProducts.filter(item => item.product_id.indexOf(payload.id) > -1);
            let findProductIndex = getLocalCart.cartProducts.findIndex((item) => item.product_id === payload.id);
            let storeProducts = getLocalCart.cartProducts;
            if (findProductIndex > -1) {
                let quantity = parseInt(getLocalCart.cartProducts[findProductIndex].quantity);
                logfunction("QTY", quantity)
                getLocalCart.cartProducts.splice(findProductIndex, 1);
                storeProducts.push({
                    product_id: payload.id, quantity: quantity + payload.quantity
                });
            }
            else {
                storeProducts.push({
                    product_id: payload.id, quantity: payload.quantity
                });
            }
            let totalQty = parseInt(getLocalCart.totalCount);
            logfunction("TOTAL ", totalQty)
            let storeArr = { cartProducts: storeProducts, totalCount: totalQty + payload.quantity };
            logfunction("FINAL ARRR ", storeArr)
            AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
            yield put(successCart(storeArr))
        }
        else {
            let storeArr = { cartProducts: [{ product_id: payload.id, quantity: payload.quantity }], totalCount: payload.quantity };
            logfunction("storeArr ", storeArr);
            AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
            yield put(successCart(storeArr));
        }

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* removeFromCart(action) {
    try {
        const { payload } = action;
        let newArr = [];
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);
        let finalCount = getLocalCart.totalCount;
        logfunction("finalCount", finalCount)
        logfunction("getLocalCart", getLocalCart)
        getLocalCart.cartProducts.forEach(function (item, index) {
            if (item.product_id != payload.id) {
                newArr.push(item);
            }
            else {
                finalCount -= item.quantity;
                logfunction("ITEM TO DEELTE", item)
            }
        });

        logfunction("QUANTITY ", finalCount)

        logfunction("NEW ARRR", newArr)
        let storeArr = { cartProducts: newArr, totalCount: finalCount };
        logfunction("ARR TO STORE ", storeArr)
        AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
        yield put(successCart(storeArr));

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* incrementQuantity(action) {
    try {
        const { payload } = action;
        let newArr = [];
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);
        let finalCount = getLocalCart.totalCount;
        logfunction("finalCount", finalCount)
        logfunction("getLocalCart", getLocalCart)

        let findProduct = getLocalCart.cartProducts.filter(item => item.product_id.indexOf(payload.id) > -1);
        let findProductIndex = getLocalCart.cartProducts.findIndex((item) => item.product_id === payload.id);

        getLocalCart.cartProducts.push({
            product_id: findProduct[0].product_id,
            quantity: parseInt(findProduct[0].quantity) + 1
        });
        getLocalCart.cartProducts.splice(findProductIndex, 1);

        let storeArr = { cartProducts: getLocalCart.cartProducts, totalCount: finalCount + 1 };

        logfunction("ARR TO STORE ", storeArr)
        AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
        yield put(successCart(storeArr));

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* decrementQuantity(action) {
    try {
        const { payload } = action;
        let newArr = [];
        let getLocalCart = yield call(AsyncStorage.getItem, "CART_DATA")
        getLocalCart = JSON.parse(getLocalCart);
        let finalCount = getLocalCart.totalCount;
        logfunction("finalCount", finalCount)
        logfunction("getLocalCart", getLocalCart)

        let findProduct = getLocalCart.cartProducts.filter(item => item.product_id.indexOf(payload.id) > -1);
        let findProductIndex = getLocalCart.cartProducts.findIndex((item) => item.product_id === payload.id);

        getLocalCart.cartProducts.push({
            product_id: findProduct[0].product_id,
            quantity: parseInt(findProduct[0].quantity) - 1
        });
        getLocalCart.cartProducts.splice(findProductIndex, 1);

        let storeArr = { cartProducts: getLocalCart.cartProducts, totalCount: finalCount - 1 };

        logfunction("ARR TO STORE ", storeArr)
        AsyncStorage.setItem('CART_DATA', JSON.stringify(storeArr));
        yield put(successCart(storeArr));

    } catch (e) {
        logfunction('ERROR =', e)
    }
}


function* proceedCheckout(action) {
    try {
        AsyncStorage.removeItem('CART_DATA');
        yield put(successCheckout());

    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* addToWishlist(action) {
    try {
        let wishData = { totalCount: action.payload.data.length, wishlistData: action.payload.data }
        yield put(successWishlist(wishData));
    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* getHomeData() {
    try {
        let homeData = yield call(
            getDataService.getData, { url: ('/homepage')}
        );
        yield put(getHomeSuccess(homeData.data));
    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* getProductDetailsData($id=0) {
    try {
        let detailsData = yield call(
            getDataService.getData, { url: ('/details/'+$id+'/0/s') }
        );
        console.log("detailsData", detailsData)
        yield put(getProductDetailsSuccess(detailsData.data));
    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* doLogin(action) {
    try {
        const { payload } = action;
        AsyncStorage.setItem('IS_AUTH', '1');
        yield put(authStatus(true));
    } catch (e) {
        logfunction('ERROR =', e)
    }
}

function* doLogout(action) {
    try {
        const { payload } = action;
        AsyncStorage.removeItem('IS_AUTH');
        yield put(authStatus(false));
    } catch (e) {
        logfunction('ERROR =', e)
    }
}
