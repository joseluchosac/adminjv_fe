import "../../assets/css/loaders.css";
interface DivProps  extends React.HTMLAttributes<HTMLDivElement> {}

export function LdsEllipsisCenter({className, innerRef}:any) {
  return (
    <div 
      ref={innerRef} 
      className = {`
        ${className ? className : ''} 
        lds-ellipsis-container 
        position-absolute 
        top-0 start-0 end-0 bottom-0 
        d-flex align-items-center justify-content-center`
      }
    >
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}


export const LdsBar: React.FC<DivProps > = (props) => {
  return (
    <div {...props} 
      className={`lds-bar position-absolute top-0 start-0${
        props.className ? (' ' + props.className) : ''
      }`}
    ></div>
  );
}

export function LdsDots11(props: DivProps){
  return (
    <div {...props} 
      className={`
        lds-dots-11 
        ${props.className ? (' ' + props.className) : ''}
      `}
    ></div>
  );
}