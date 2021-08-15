import {DrawerForm} from './DrawerForm';
import {Route, Switch} from './Router';

export const Form = () => {
    return (
        <Switch>
            <Route path="/add">
                <DrawerForm />
            </Route>
            <Route path="/edit/:id">
                <DrawerForm />
            </Route>
        </Switch>
    );
};
