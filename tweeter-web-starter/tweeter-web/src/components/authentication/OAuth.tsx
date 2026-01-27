import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastType } from "../toaster/Toast";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface Props {
  platformName : string
}

const OAuth = (props:Props) => {
  const { displayToast } = useContext(ToastActionsContext);

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayToast(
      ToastType.Info,
      message,
      3000,
      undefined,
      "text-white bg-primary",
    );
  };

  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() =>
        displayInfoMessageWithDarkBackground(
          `${props.platformName} registration is not implemented.`,
        )
      }
    >
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="{props.platformName}Tooltip">{props.platformName}</Tooltip>}
      >
        <FontAwesomeIcon icon={["fab", props.platformName.toLowerCase() as IconName]} />
      </OverlayTrigger>
    </button>
  );
};

export default OAuth