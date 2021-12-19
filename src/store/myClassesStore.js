import {makeAutoObservable} from "mobx";
import {
    createClassRequest,
    createPracticeClassRequest,
    createTheoreticClassRequest,
    createTurnkeyClassRequest,
    getClassesRequest,
    updateClassRequest,
    updatePracticeClassRequest,
    updateTheoreticClassRequest,
    updateTurnkeyClassRequest
} from "../api/api_my_classes";
import publicStore from "./publicStore";
import authStore from "./authStore";

class MyClassesStore {
    constructor() {
        makeAutoObservable(this)
    }

    async getClasses() {
        let r = await getClassesRequest()
        return JSON.parse(r.data.classes)
    }

    async createMainClass(class_name, description, tags) {
        try {
            let r = await createClassRequest(class_name, description, tags)
            return r.data.class_is
        } catch (e) {

        }
    }

    async createTheoreticClass(parent_id, time, duration_15, price_15, duration_30, price_30, duration_60, price_60, duration_90, price_90) {
        let r = await createTheoreticClassRequest(parent_id, time, duration_15, price_15, duration_30, price_30, duration_60, price_60, duration_90, price_90)
        return r.data
    }

    async createPracticeClass(parent_id, time, duration_15, price_15, duration_30, price_30, duration_60, price_60, duration_90, price_90) {
        let r = await createPracticeClassRequest(parent_id, time, duration_15, price_15, duration_30, price_30, duration_60, price_60, duration_90, price_90)
        return r.data
    }

    async createTurnkeyClass(parent_id, time, duration_15, price_15, full_time, price_full_time) {
        let r = await createTurnkeyClassRequest(parent_id, time, duration_15, price_15, full_time, price_full_time)
        return r.data
    }






    async updateMainClass(class_id, class_name, description, tags) {
        try {
            let r = await updateClassRequest(class_id, class_name, description, tags)
            console.log('updateMainCLass', r.data)
        } catch (e) {

        }
    }

    async updateTheoreticClass(class_id, parent_id, time, duration_15, price_15, duration_30, price_30, duration_60, price_60, duration_90, price_90) {
        let r = await updateTheoreticClassRequest(class_id, parent_id, time, duration_15, price_15, duration_30, price_30, duration_60, price_60, duration_90, price_90)
        return r.data
    }

    async updatePracticeClass(class_id, parent_id, time, duration_15, price_15, duration_30, price_30, duration_60, price_60, duration_90, price_90) {
        let r = await updatePracticeClassRequest(class_id, parent_id, time, duration_15, price_15, duration_30, price_30, duration_60, price_60, duration_90, price_90)
        return r.data
    }

    async updateTurnkeyClass(class_id, parent_id, time, duration_15, price_15, full_time, price_full_time) {
        let r = await updateTurnkeyClassRequest(class_id, parent_id, time, duration_15, price_15, full_time, price_full_time)
        return r.data
    }






    async createClass(class_name, description, tags, theory_class_state, practice_class_state, turnkey_state) {
        let parent_id = await this.createMainClass(class_name, description, tags)
        if (theory_class_state.valid) {
            let time = [].concat(...theory_class_state.calendar).join('')
            let r = await createTheoreticClassRequest(
                parent_id,
                time,
                theory_class_state['15_min'].status,
                theory_class_state['15_min'].price,
                theory_class_state['30_min'].status,
                theory_class_state['30_min'].price,
                theory_class_state['60_min'].status,
                theory_class_state['60_min'].price,
                theory_class_state['90_min'].status,
                theory_class_state['90_min'].price)
        }

        if (practice_class_state.valid) {
            let time = [].concat(...practice_class_state.calendar).join('')
            let r = await createPracticeClassRequest(
                parent_id,
                time,
                practice_class_state['15_min'].status,
                practice_class_state['15_min'].price,
                practice_class_state['30_min'].status,
                practice_class_state['30_min'].price,
                practice_class_state['60_min'].status,
                practice_class_state['60_min'].price,
                practice_class_state['90_min'].status,
                practice_class_state['90_min'].price)
        }

        if (turnkey_state.valid) {
            let time = [].concat(...practice_class_state.calendar).join('')
            let r = await createTurnkeyClassRequest(
                parent_id,
                time,
                turnkey_state['15_min'].status,
                turnkey_state['15_min'].price,
                turnkey_state.individual_term.status,
                turnkey_state.individual_term.price,
                )
        }

        return parent_id
    }

    async updateClass(classItem, class_name, description, tags, theoryState, practiceState, turnkeyState) {
        //Меняем родитель занятий
        let r = await this.updateMainClass(classItem.ID, class_name, description, tags)

        // Проверяем валидность состояния теоретического занятия
        if (theoryState.valid) {
            //Проверяем, существует ли такое занятие уже
            if (classItem.TheoreticClass.ClassParentId === 0) {
                let r = await this.createTheoreticClass(
                    classItem.ID,
                    [].concat(...theoryState.calendar).join(''),
                    theoryState["15_min"].status,
                    theoryState["15_min"].price,
                    theoryState["30_min"].status,
                    theoryState["30_min"].price,
                    theoryState["60_min"].status,
                    theoryState["60_min"].price,
                    theoryState["90_min"].status,
                    theoryState["90_min"].price
                )
            }
            else {
                let r = await this.updateTheoreticClass(
                    classItem.TheoreticClass.ID,
                    authStore.user.id,
                    [].concat(...theoryState.calendar).join(''),
                    theoryState["15_min"].status,
                    theoryState["15_min"].price,
                    theoryState["30_min"].status,
                    theoryState["30_min"].price,
                    theoryState["60_min"].status,
                    theoryState["60_min"].price,
                    theoryState["90_min"].status,
                    theoryState["90_min"].price
                )
            }
        }

        if (practiceState.valid) {
            //Проверяем, существует ли такое занятие уже
            if (classItem.PracticClass.ClassParentId === 0) {
                let r = await this.createPracticeClass(
                    classItem.ID,
                    [].concat(...practiceState.calendar).join(''),
                    practiceState["15_min"].status,
                    practiceState["15_min"].price,
                    practiceState["30_min"].status,
                    practiceState["30_min"].price,
                    practiceState["60_min"].status,
                    practiceState["60_min"].price,
                    practiceState["90_min"].status,
                    practiceState["90_min"].price
                )
            }
            else {
                let r = await this.updatePracticeClass(
                    classItem.PracticClass.ID,
                    authStore.user.id,
                    [].concat(...practiceState.calendar).join(''),
                    practiceState["15_min"].status,
                    practiceState["15_min"].price,
                    practiceState["30_min"].status,
                    practiceState["30_min"].price,
                    practiceState["60_min"].status,
                    practiceState["60_min"].price,
                    practiceState["90_min"].status,
                    practiceState["90_min"].price
                )
            }
        }

        if (turnkeyState.valid) {
            //Проверяем, существует ли такое занятие уже
            if (classItem.KeyClass.ClassParentId === 0) {
                debugger
                let r = await this.createTurnkeyClass(
                    classItem.ID,
                    [].concat(...turnkeyState.calendar).join(''),
                    turnkeyState["15_min"].status,
                    turnkeyState["15_min"].price,
                    turnkeyState.individual_term.status,
                    turnkeyState.individual_term.price
                )
            }
            else {
                let r = await this.updateTurnkeyClass(
                    classItem.KeyClass.ID,
                    authStore.user.id,
                    [].concat(...turnkeyState.calendar).join(''),
                    turnkeyState["15_min"].status,
                    turnkeyState["15_min"].price,
                    turnkeyState.individual_term.status,
                    turnkeyState.individual_term.price
                )
            }
        }
    }




    async initializeEditClasses() {
        let res = await Promise.all([
            await publicStore.getChildTags(),
            await this.getClasses()
        ])
        return {
            childTags: res[0],
            myClasses: res[1]
        }
    }

}

export default new MyClassesStore()