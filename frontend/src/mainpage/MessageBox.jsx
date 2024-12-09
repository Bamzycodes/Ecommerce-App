export default function MessageBox(props) {
    const variantClass = {
      
      info: 'alert-info',
      success: 'alert-success',
      danger: 'alert-error',
      warning: 'alert-warning',
    }[props.variant || 'info'];
  
    return (
      <div className={`alert ${variantClass}`}>
        {props.children}
      </div>
    );
} 