import Modal from "react-modal";

import "./index.scss";
import PropTypes from "prop-types";
// import { Button } from "symphony-ui";

// interface AddContactProps {
//   isOpen: boolean;
//   onClose: () => void;
//   theme?: string;
//   onAfterOpen?: () => void;
//   contactId: string | undefined;
// }

const CameraModal = ({ isOpen, onAfterOpen, onClose, onConfirm }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onAfterOpen={onAfterOpen}
        onRequestClose={onClose}
        style={{ content: { borderRadius: "24px", width: "100%", maxWidth: "450px", background: "rgba(255, 255, 255, 1)" }, overlay: { backgroundColor: "rgba(0,0,0,0.7)" } }}
        contentLabel="Example Modal"
      >
        <>
          <div className="h-[23vh] hiddenScrollBar   overflow-y-scroll">
            <div className="px-10">
              <div className="flex flex-col justify-center items-center">
                <p className="text-gray-700 pb-4  font-[600] text-[19px] leading-[24px]">Camera Access</p>
                <p className="text-gray-700  font-[500] text-[16px] leading-[21px] whitespace-nowrap">To get started, you need to enable</p>
                <p className="text-gray-700  font-[500] text-[16px] leading-[21px] whitespace-nowrap">camera access</p>
              </div>
              <div className="mt-6 flex items-center justify-between space-x-3 px-10 leading-[20px] text-[14px] font-[500] tracking-tight">
                <button className="text-[#6D28D9] bg-white w-[140px] h-[44px] rounded-[27px] border-[#6D28D9]" onClick={onClose}>
                  Cancel
                </button>
                <button className="bg-[#6D28D9] text-white w-[140px] h-[44px] rounded-[27px]" onClick={onConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};
CameraModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onAfterOpen: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
export default CameraModal;
