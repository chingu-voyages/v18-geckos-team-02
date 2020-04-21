import { setFile } from '../dataController';
import dummyData from './dummyData';

export default function loadDummyData() {
    for (let fileObj of dummyData) {
        setFile(fileObj);
    }
}