import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const ReactCSV = (props) => {

    const dishes = props.allDishes.map((dish) => ({
        ID: dish.id,
        Pavadinimas: dish.name,
        Aprašymas: dish.description,
        Kaina: dish.price,
        Paruošimo_trukmė: dish.preparationTimeInMinutes,
        Restorano_ID: dish.restaurantId,
        Restorano_pavadinimas: dish.restaurantName,
        Meniu_ID: dish.menuId,
        Meniu_pavadinimas: dish.menuName,

    }));

    return (
        <div>
            <CSVLink
                data={dishes}
                filename={"Patiekalai"}
                target="_blank"
                style={{ color: "white" }}
            >
                Atsisiųsti patiekalus <FontAwesomeIcon icon="download" style={{ paddingBottom: 2.5 }} />
            </CSVLink>
        </div>
    )
};

export default ReactCSV;