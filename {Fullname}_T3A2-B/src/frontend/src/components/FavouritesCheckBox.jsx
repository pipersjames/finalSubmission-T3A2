import Cookies from "js-cookie";
import { FavouritesContext } from "../contexts/FavouritesProvider";
import { useContext, useEffect, useState } from "react";


export default function FavouritesCheckBox({formName, preview}) {
    //cookies
    const jwt = Cookies.get('jwt')
    //contexts
    const {getFavourites, patchFavourites, favourites} = useContext(FavouritesContext)
    //useStates
    const [isChecked, setIsChecked] = useState(false);
    //handles
    const handleFavCheckboxChange = () => {
        try {
            const newCheckedState = !isChecked;
            setIsChecked(newCheckedState);

            let updatedFavourites = [...favourites];
            console.log(updatedFavourites)
            
            if (favourites.length === 0) {
                updatedFavourites.push(formName);
            } else if (newCheckedState && !favourites.includes(formName)) {
                updatedFavourites.push(formName);
            } else if (!newCheckedState) {
                updatedFavourites = favourites.filter(form => form !== formName);
            }
            patchFavourites(updatedFavourites, jwt);
        } catch (error) {
            console.error('Error handling checkbox change:', error);
        }
    }
    //useEffects
    useEffect(() => {
        getFavourites(jwt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    useEffect(() => {
        if (formName && favourites.includes(formName)) {
            setIsChecked(true);
        } else {
            setIsChecked(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formName,favourites]);
    return (
        <div className="form-check mx-3 ">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        id="favCheckBox"
                                        checked={isChecked}
                                        onChange={handleFavCheckboxChange} 
                                        disabled={preview}
                                        />
                                    <label className="form-check-label" htmlFor="favCheckBox">Favourite</label>
                                </div>
    )
}