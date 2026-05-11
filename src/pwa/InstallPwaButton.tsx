import {Button} from '@chakra-ui/react';
import {useLocaleText} from '../locales';
import {promptPwaInstall, usePwaInstallSnapshot} from './store';

export const InstallPwaButton = () => {
    const installText = useLocaleText('pwa.install');
    const {canInstall, installed, isPrompting} = usePwaInstallSnapshot();

    if (installed || !canInstall) {
        return null;
    }

    return (
        <Button
            size="sm"
            onClick={promptPwaInstall}
            isDisabled={isPrompting}
        >
            {installText}
        </Button>
    );
};
