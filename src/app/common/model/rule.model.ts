import { Constraint } from './constraint.model';

export class Rule {

    constructor(rule){
        this.id = rule.id;
        this.code = rule.code;
        this.description = rule.description;
        this.constraints = rule.constraints;
        this.isEditing = rule.isEditing;
    }

    id: number;
    code: string;
    description: string;
    constraints: Array<Constraint>;
    isEditing?: boolean;
    expanded?: boolean;
}