function Button(props) {
  return (
    <button
      className="primary_btn buttons d-flex mx-auto"
      onClick={props.handleClick}
    >
      {props.text}
    </button>
  );
}
export default Button;
