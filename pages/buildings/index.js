import {Fragment, useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {FaPlus, FaPen, FaTrash, FaUserCircle} from 'react-icons/fa'
import toastr from 'toastr';
import styles from './index.module.css';
import BuildingFormModal from "../../components/BuildingFormModal";
import ConfirmModal from "../../components/ConfirmModal";
import {destroy, loadData} from "../../store/buildingSlicer";

export default function Buildings() {

    const buildings = useSelector(state => state.building.buildings);
    const dataLoaded = useSelector(state => state.building.isLoaded);
    const dispatch = useDispatch();

    const [formModalOpen, setFormModalOpen] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedBuildingId, setSelectedBuildingId] = useState(null);

    const [loading, setLoading] = useState(false);

    const [buildingToEdit, setBuildingToEdit] = useState({});

    useEffect(() => {
        if (!dataLoaded) {
            setLoading(true);
            setTimeout(() => {
                dispatch(loadData());
                setLoading(false);
            }, 500);
        }
    }, []);
    console.log('buiddasdasdasd', buildings);

    function toggleFormModal(cb, buildingId) {
        setBuildingToEdit({});
        if (typeof buildingId !== 'undefined') {
            setSelectedBuildingId(buildingId);

            if (buildingId === null) return;

            const building = buildings.filter(b => b.id.toString() === buildingId.toString())[0];
            setBuildingToEdit(building);
        }
        setFormModalOpen(!formModalOpen);
        if (typeof cb !== 'undefined') {
            cb();
        }
    }

    function toggleConfirmModal(cb, buildingId) {
        setConfirmModalOpen(!confirmModalOpen);
        if (typeof buildingId !== 'undefined') {
            setSelectedBuildingId(buildingId);
        }
        if (typeof cb !== 'undefined' && cb !== null) {
            cb();
        }
    }

    function deleteBuilding() {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            dispatch(destroy(selectedBuildingId));
            toastr.success('Building was successfully removed');
        }, 500);
    }

    if (loading) {
        return (
            <div className="jumbotron">
                <h3 className="text-center">Please wait...</h3>
            </div>
        );
    }

    return (
        <Fragment>
            <ConfirmModal {...{
                modalOpen: confirmModalOpen,
                toggle: toggleConfirmModal,
                toggleCallback: deleteBuilding,
                modalTitle: 'Delete building confirmation'
            }}/>
            <BuildingFormModal {...{
                modalOpen: formModalOpen, toggle: toggleFormModal,
                modalTitle: selectedBuildingId ? 'Edit building' : 'Add building',
                building: buildingToEdit
            }}/>
            <nav className="navbar navbar-light bg-primary">
                <span className="navbar-brand mb-0 h1 text-white">Welcome</span>
                <FaUserCircle color="white" style={{width: 32, height: 32}}/>
            </nav>
            <div className="jumbotron">
                <div className="d-flex justify-content-end mb-2">
                    <button className="btn btn-primary" onClick={() => toggleFormModal()}>
                        <FaPlus style={{width: 16, height: 16}}/>
                    </button>
                </div>

                {buildings.length > 0 ? <table className={styles.buildingsTable}>
                    <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Area</th>
                        <th>Location</th>
                        <th>Image</th>
                        <th>Action</th>
                    </tr>
                    {buildings.map(b => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.name}</td>
                            <td>{b.area}</td>
                            <td>{b.location}</td>
                            <td>{b.image ?
                                <img src={b.image} width="20%" className="img-thumbnail"
                                     alt="no image"/> : 'No image'}</td>
                            <td>
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-secondary mr-2"
                                            onClick={() => toggleFormModal(undefined, b.id)}>
                                        <FaPen style={{width: 16, height: 16}}/>
                                    </button>
                                    <button className="btn btn-danger"
                                            onClick={() => toggleConfirmModal(null, b.id)}>
                                        <FaTrash style={{width: 16, height: 16}}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table> : <h3>No buildings...</h3>}
            </div>
        </Fragment>
    )
}
