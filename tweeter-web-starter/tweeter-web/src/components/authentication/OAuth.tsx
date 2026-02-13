import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import { useMessageActions } from "../toaster/MessageHooks";
import { OAuthPresenter } from "../../presenter/Authentication/OAuthPresenter";

interface Props {
  platformName: string;
}

const OAuth = (props: Props) => {
  const { displayInfoMessage } = useMessageActions();

  const presenter = new OAuthPresenter({displayInfoMessage})
  

  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={() =>
        presenter.displayInfoMessageWithDarkBackground(
          `${props.platformName} registration is not implemented.`,
        )
      }
    >
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="{props.platformName}Tooltip">
            {props.platformName}
          </Tooltip>
        }
      >
        <FontAwesomeIcon
          icon={["fab", props.platformName.toLowerCase() as IconName]}
        />
      </OverlayTrigger>
    </button>
  );
};

export default OAuth;
