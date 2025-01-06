import React, { useState } from "react";

interface ModalProps {
  title: string;
  description?: string;
  content: React.ReactNode;
  triggerButton: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  title,
  description,
  content,
  triggerButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Botón para abrir el modal */}
      <div onClick={openModal} className="inline-block">
        {triggerButton}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-auto max-w-full">
            {/* Botón para cerrar el modal */}
            <div className="flex justify-end">
              <button
                className="text-gray-400 hover:text-gray-300 text-2xl font-bold text-center"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            {/* Contenido del modal */}
            <div className="mt-0">
              <h2 className="text-2xl font-bold mb-2 text-center">{title}</h2>
              {description && (
                <p className="text-gray-300 text-sm mb-4">{description}</p>
              )}
              <div className="mb-4">{content}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
