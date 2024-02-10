import PropTypes from "prop-types";
// type LanguageModalProps = {
//   theme?: string,
//   showModal: boolean,
//   onCloseModal: () => void,
//   onConfirm: () => void,
// };

const CameraAccess = ({ showModal, onCloseModal, onConfirm }) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={onCloseModal}>
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-fit sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4">
                <div className="pt-1 pb-2 space-y-6">
                  <div className="mt-3 text-center space-y-2 ">
                    <h3 className="text-[16px] leading-[25px] font-[400] text-secondary-color">Are you sure you want to exit?</h3>
                  </div>
                  <div className="flex  space-x-[30px] text-primary-color text-[16px] leading-[24px] font-[500] justify-center">
                    <p onClick={onConfirm} className="cursor-pointer">
                      Confirm
                    </p>
                    <p className="cursor-pointer" onClick={onCloseModal}>
                      Cancel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

CameraAccess.propTypes = {
  showModal: PropTypes.bool.isRequired,

  onCloseModal: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default CameraAccess;
