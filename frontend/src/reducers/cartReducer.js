import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_REPLACE_ITEM, CART_RESET_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD, CART_SAVE_SHIPPING_ADDRESS } from "../constants/cartConstants"; 

export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch(action.type) {
        case CART_REPLACE_ITEM:
            const item = action.payload;
            const existItem = state.cartItems.find(x => x.product === item.product)
            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x)
                }
            } else {
                return {
                    ...state, 
                    cartItems: [...state.cartItems, item]
                }
            }
        case CART_ADD_ITEM:
            const curr_item = action.payload
            const curr_existItem = state.cartItems.find(x => x.product === curr_item.product)
            const tempCartItems = state.cartItems
            for (let i = 0; i < tempCartItems.length; i++) {
                if (curr_existItem !== undefined && curr_existItem.product === tempCartItems[i].product) {
                    tempCartItems[i].quantity += curr_item.quantity
                }
            }
            if (curr_existItem) {
                return {
                    ...state,
                    // This simply maps the current product to an updated inputted product based on its selected quantity
                    cartItems: tempCartItems
                }
            } else {
                return {
                    ...state, 
                    cartItems: [...state.cartItems, curr_item]
                }
            }
        case CART_REMOVE_ITEM:
            return {
                ...state, 
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state, 
                shippingAddress: action.payload
            }
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state, 
                paymentMethod: action.payload
            }
        case CART_RESET_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: {}
            }
        default:
            return state
    }
}