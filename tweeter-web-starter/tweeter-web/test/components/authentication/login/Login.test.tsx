import Login from "../../../../src/components/authentication/login/Login"
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {userEvent} from "@testing-library/user-event";
import "@testing-library/jest-dom"
import {fab} from "@fortawesome/free-brands-svg-icons";
import {library} from "@fortawesome/fontawesome-svg-core";
import {LoginPresenter} from "../../../../src/presenter/Authentication/LoginPresenter";
import {anything, instance, mock, verify} from "@typestrong/ts-mockito";

library.add(fab)

describe("Login component tests", () => {

    it("disables sign-in button when first renders", () => {
        const {signInButton} = renderLoginGetElements("/")
        expect(signInButton).toBeDisabled()
    })

    it("enables sign in button when both fields have text", validateButtonEnabling)
    it("disables sign in button when either field is cleared", async () => {
        const {user, signInButton, aliasField, passwordField} = await validateButtonEnabling()

        await user.clear(aliasField)
        expect(signInButton).toBeDisabled()

        await user.type(aliasField, "a")
        await user.clear(passwordField)
        expect(signInButton).toBeDisabled()
    })
    it("verifies the presenter calls the login method with correct parameters", async () => {
        const mockPresenter = mock<LoginPresenter>()
        const mockPresenterInstance = instance(mockPresenter)

        const original_url = "/"
        const alias = "@johnstockton"
        const password = "15806"

        const {
            user,
            signInButton,
            aliasField,
            passwordField
        } = renderLoginGetElements(original_url, mockPresenterInstance)

        await user.type(aliasField, alias)
        await user.type(passwordField, password)
        await user.click(signInButton)

        verify(mockPresenter.doLogin(alias, password, anything(), original_url)).once()

    })
})

async function validateButtonEnabling() {
    const {user, signInButton, aliasField, passwordField} = renderLoginGetElements("/")

    await user.type(aliasField, "a")
    await user.type(passwordField, "p")
    expect(signInButton).toBeEnabled()
    return {user, signInButton, aliasField, passwordField}
}

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            {!!presenter ? (<Login originalUrl={originalUrl} presenter={presenter}></Login>) : (
                <Login originalUrl={originalUrl}></Login>)}
        </MemoryRouter>
    )
}

function renderLoginGetElements(originalURL: string, presenter?: LoginPresenter) {
    const user = userEvent.setup()

    renderLogin(originalURL, presenter);

    const signInButton = screen.getByRole("button", {name: /Sign in/i});
    const aliasField = screen.getByLabelText("alias")
    const passwordField = screen.getByLabelText("password")

    return {user, signInButton, aliasField, passwordField}
}