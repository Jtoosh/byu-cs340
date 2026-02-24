import "./App.css";
import {useContext} from "react";
import {UserInfoContext} from "./components/userInfo/UserInfoContexts";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import ItemScroller from "./components/mainLayout/ItemScroller";
import {FeedPresenter} from "./presenter/StatusItem/FeedPresenter";
import {StoryPresenter} from "./presenter/StatusItem/StoryPresenter";
import {FolloweePresenter} from "./presenter/UserItem/FolloweePresenter";
import {FollowerPresenter} from "./presenter/UserItem/FollowerPresenter";
import {PagedPresenterView} from "./presenter/PagedPresenter";
import {Status, User} from "tweeter-shared";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
    const {currentUser, authToken} = useContext(UserInfoContext);

    const isAuthenticated = (): boolean => {
        return !!currentUser && !!authToken;
    };

    return (
        <div>
            <Toaster position="top-right"/>
            <BrowserRouter>
                {isAuthenticated() ? (
                    <AuthenticatedRoutes/>
                ) : (
                    <UnauthenticatedRoutes/>
                )}
            </BrowserRouter>
        </div>
    );
};

const AuthenticatedRoutes = () => {
    const {displayedUser} = useContext(UserInfoContext);
    const StatusItemFactory = (item: Status, featureUrl: string) => {
        return <StatusItem status={item} featurePath={featureUrl}/>
    }
    const UserItemFactory = (item: User, featureUrl: string) => {
        return <UserItem user={item} featurePath={featureUrl}/>
    }

    return (
        <Routes>
            <Route element={<MainLayout/>}>
                <Route
                    index
                    element={<Navigate to={`/feed/${displayedUser!.alias}`}/>}
                />
                <Route
                    path="feed/:displayedUser"
                    element={
                        <ItemScroller
                            featureUrl="/feed"
                            presenterFactory={(view: PagedPresenterView<Status>) =>
                                new FeedPresenter(view)
                            }
                            componentFactory={StatusItemFactory}
                        />
                    }
                />
                <Route
                    path="story/:displayedUser"
                    element={
                        <ItemScroller
                            featureUrl="/story"
                            presenterFactory={(view: PagedPresenterView<Status>) =>
                                new StoryPresenter(view)
                            }
                            componentFactory={StatusItemFactory}
                        />
                    }
                />
                <Route
                    path="followees/:displayedUser"
                    element={
                        <ItemScroller
                            key={`followees-${displayedUser!.alias}`}
                            featureUrl="/followees"
                            presenterFactory={(view: PagedPresenterView<User>) =>
                                new FolloweePresenter(view)
                            }
                            componentFactory={UserItemFactory}
                        />
                    }
                />
                <Route
                    path="followers/:displayedUser"
                    element={
                        <ItemScroller
                            key={`followers-${displayedUser!.alias}`}
                            featureUrl="/followers"
                            presenterFactory={(view: PagedPresenterView<User>) =>
                                new FollowerPresenter(view)
                            }
                            componentFactory={UserItemFactory}
                        />
                    }
                />
                <Route path="logout" element={<Navigate to="/login"/>}/>
                <Route
                    path="*"
                    element={<Navigate to={`/feed/${displayedUser!.alias}`}/>}
                />
            </Route>
        </Routes>
    );
};

const UnauthenticatedRoutes = () => {
    const location = useLocation();

    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="*" element={<Login originalUrl={location.pathname}/>}/>
        </Routes>
    );
};

export default App;
