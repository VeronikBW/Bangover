export const initialStore=()=>{
  return{
    message: null,
    activity: null,
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    favorities: [],
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'set_user':
      return {
        ...store,
        user: action.payload
      };

    case 'set_token':
      return {
        ...store,
        token: action.payload
      };

    case 'set_favorities':
      return {
        ...store,
        favorities: action.payload
      };

    case 'add_favorite':
      return {
        ...store,
        favorities: [...store.favorities, action.payload]
      };

    case 'remove_favorite':
      return {
        ...store,
        favorities: store.favorities.filter(favorite => favorite.id !== action.payload)
      };

    case 'logout':
      return {
        ...store,
        user: null,
        token: null,
        favorities: [],
        isAuthenticated: false,
      };

    case 'set_activity':
      return {
        ...store,
        activity: action.payload
      };


    default:
      throw Error('Unknown action.');
  }    
}
