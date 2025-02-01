declare global {
    namespace App {
        interface Locals {
            session: Session;
            userID: ObjectId;
        }
    }
}

export {};
