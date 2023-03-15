function OutlineButton(props) {
  return (
    <button
      className="outline_btn buttons"
      onClick={props.handleClick}>
      {props.text}
    </button>
  );
}
export default OutlineButton;
