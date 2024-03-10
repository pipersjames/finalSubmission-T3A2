
import { NavLink } from 'react-router-dom';
import { Container } from 'react-bootstrap';


export default function FavouriteForms(fav) {



  return (
    <NavLink to={`/forms/${fav.fav}`}>
    <Container>
            <div className="row">
                <div>
                <div className="card bg-primary text-white mb-3">
                    <div className="card-body">
                        <h3 className="card-title">{fav.fav} Form</h3>
                    <p className="card-text">Click here to fill out the {fav.fav} Form</p>
                    </div>
                </div>
                </div>
            </div>
    </Container>
    </NavLink>
  );
}

