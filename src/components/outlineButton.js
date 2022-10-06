function OutlineButton(props) {
  return (
    <button
      className="outline_btn buttons d-flex mx-auto"
      onClick={props.handleClick}>
      {props.text}
    </button>
  );
}
export default OutlineButton;
