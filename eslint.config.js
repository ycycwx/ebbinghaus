import {flatConfigs} from '@yotsubacy/config/eslint';

export default flatConfigs.build(
    [
        'node',
        'browser',
        'react',
        'typescript',
    ],
    {
        tsconfigRootDir: import.meta.dirname,
    }
);
