import { useEffect , useState , useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ setModalState, hideModal , show, children , myref }) => {

    /*const savedhide = useRef(hideModal);
    console.log(myref , 1)
    useEffect(()=>{
      savedhide.current = hideModal;
    })

    const handleOutsideClick = (e) => {
          if( myref.current && !myref.current.contains(e.target))
            savedhide.current();
    }

    useEffect(()=>{
      if(show) {
        document.addEventListener('click',handleOutsideClick,true);
        return ()=>{
          document.removeEventListener('click' , handleOutsideClick , true);
        }
    }
    },[show])
    */
    const modalref = useRef(null);

    if(!modalref.current){
      const div = document.createElement('div');
      modalref.current = div;
    }

    useEffect(()=>{
      const modelRoot = document.getElementById('portal');
      modelRoot.appendChild(modalref.current);
      return ()=>{
        modelRoot.removeChild(modalref.current);
      }
    },[])

    return createPortal(
      <div className="modal display-block">
        <section className="modal-main">
          {children}
        </section>
      </div>,
      modalref.current
    );
  };

export default Modal;