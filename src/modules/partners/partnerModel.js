import { Modal,Button } from 'react-bootstrap';
const DeleteModal = ({ openDeleteModal, handleCloseDeleteModal, modalType }) => {
    // console.log(openDeleteModal,handleCloseDeleteModal,modalType,"id");
{/* <Modal
        open={openDeleteModal}
        onClose={() => handleCloseDeleteModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableAutoFocus={true}
        > 
        <div>
            "heyyy"
        </div>
         </Modal> */}


         <Modal
         show={openDeleteModal}
         onHide={handleCloseDeleteModal}
         aria-labelledby="contained-modal-title-vcenter"
         centered
         className="delete_modal_dialog modal-dialog-centered"
       >
         <Modal.Header>
           <Modal.Title>Delete Partner</Modal.Title>
           {/* <img
             src={close}
             alt="image"
             onClick={handleClose}
             className="close_icon"
           /> */}
         </Modal.Header>
         <Modal.Body className="partner_model_body parnter_pop_up">
           Are you sure you want to delete partner
         </Modal.Body>
         <Modal.Footer className='delete-moal-popup'>
           <Button
             variant="secondary"
             className="secondary_btn"
            //  onClick={handleClose}
           >
             No
           </Button>
           <Button
             variant="primary"
             className="primary_btn"
            //  onClick={() => handleDelete(partyIdVal)}
           >
             Yes
           </Button>
         </Modal.Footer>
       </Modal>
}
export default DeleteModal