import { formatDate } from '../dataController';
const currentDateTime = formatDate(1586427391156);
export default {
    1: {
        file: '/tests/dummyFiles/testfile1.txt',
        timeStamps: {
            created: currentDateTime,
            modified: currentDateTime,
            user: currentDateTime
        },
        activeTimeStamp: 'created',
        tags: ['test1']
    },
    2: {
        file: '/tests/dummyFiles/testfile1.txt',
        timeStamps: {
            created: currentDateTime,
            modified: currentDateTime,
            user: currentDateTime
        },
        activeTimeStamp: 'created',
        tags: ['test1']
    }
}