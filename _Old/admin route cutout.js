/*
TYPE: Describes the model being used
DESCRIPTION: A description of the model that'll be published in the admin index
SORT: A field to sort any show data by
EDITABLE: defines if the dataset can be editted, so will add an edit column and buttons for each record 
SUB_DATA: an array which determines which model data sets are returned, which can then be used in edit select elements

index items
COLUMN WIDTH: sets the width of the data column on the "show" view
COLUMN NAME: the print name of the column in the "show" view
VALUE: Array that determines which field is returned and printed in the edit screen. Nested fields can be accessed by multiple items in the array
FOREACH: Used in conjunction with the VALUE field to return multiple values and make them selectable in a multi-select element. 
Single select elements don't need a foreach loop, use the type field instead
SUB_DATA: used in conunjction with the parent sub_data array, determines which dataset is used in the select statement generated
READONLY: Determines if the field is set to read only in the edit screen. Won't be passed to the server when the record is saved 
TYPE: field type in the edit screen, determines the input type of the html generated.
HEADER: prints a header field on the edit screen
STARTROW: creates a new row in the edit screen
ENDROW: ends a row in the edit screen
*/

const route_info = [
    {
        type: "Error",
        description: "return a list of all recent server and client logged errors",
        sort: {created_date: 'desc'},
        index:[
            {
                column_width: 10,
                column_name: "Class",
                value: ["class"],
                readonly: 1
            },
            {
                column_width: 10,
                column_name: "Function",
                value: ["class"],
                readonly: 1
            },
            {
                column_width: 10,
                column_name: "Created_Date",
                value: ["created_date"],
                type: "date",
                readonly: 1
            },
            {
                column_width: 20,
                column_name: "Detail",
                value: ["detail"],
                readonly: 1
            },
            {
                column_width: 10,
                column_name: "Error",
                value: ["e","message"],
                readonly: 1
            },
            {
                column_width: 40,
                column_name: "Stack",
                value: ["e","stack"],
                readonly: 1
            }                                                 
        ] 
    },
    {
        type: "Faction",
        description: "return a list of all current factions",
        sort: {created_date: 'desc'},
        sub_data: ["Squad"],
        editable: 1,        
        index:[
            {
                column_width: 20,
                column_name: "Name",
                value: ["name"],
                header: "Naming",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 20,
                column_name: "Description",
                value: ["description"],
                type: "textarea",
                startrow: 1,
                endrow: 1                
            },
            {
                column_width: 20,
                column_name: "Squads",
                value: ["squads"],
                foreach: ["name"],
                sub_data: 'Squad',
                header: "Composition",
                startrow: 1,
                endrow: 1 
            },
            {
                column_width: 20,
                column_name: "Created",
                value: ["created_date"],
                type: "date",
                header: "Dates",
                readonly: 1,
                startrow: 1,
            },
            {
                column_width: 20,
                column_name: "Updated",
                value: ["updateddate"],
                type: "date",
                readonly: 1,
                endrow: 1 
            }      
        ]     
    },
    {
        type: "Squad",
        description: "return a list of all current squads",
        sort: {created_date: 'desc'},
        sub_data: ["Unit","Gun","Melee","Armour","Upgrade","SpecialRule"],
        editable: 1,        
        index:[
            {
                column_width: 10,
                column_name: "Name",
                value: ["name"],
                header: "Name and Size",
                startrow: 1
            },
            {
                column_width: 10,
                column_name: "Min_Size",
                edit_field_width: 2,
                value: ["min_size"]
            },
            {
                column_width: 10,
                column_name: "Max_Size",
                value: ["max_size"],
                edit_field_width: 2,
                endrow: 1
            },
            {
                column_width: 10,
                column_name: "Cost_Per_Unit",
                value: ["cost_per_unit"],
                header: "Definition",
                edit_field_width: 2,
                startrow: 1,
                endrow: 1,
                readonly: 1,
            },
            {
                column_width: 10,
                column_name: "Unit",
                sub_data: 'Unit',                
                value: ["unit","name"],
                startrow: 1,
                type: "select",
            },
            {
                column_width: 10,
                column_name: "Gun",
                sub_data: 'Gun',                
                value: ["gun","name"],
                type: "select",                
            },
            {
                column_width: 10,
                column_name: "Melee",
                sub_data: 'Melee',                
                value: ["melee","name"],
                type: "select",                
            },
            {
                column_width: 10,
                column_name: "Armour",
                sub_data: 'Armour',
                value: ['armour','name'],
                type: "select",                
                endrow: 1
            },
            {
                column_width: 10,
                column_name: "Upgrades",
                value: ["upgrades"],
                foreach: ["name"],
                sub_data: 'Upgrade',             
                header: "Upgrades and Special Rules",
                startrow: 1
            },
            {
                column_width: 10,
                column_name: "Special_Rules",
                value: ["special_rules"],
                foreach: ["name"],          
                sub_data: 'SpecialRule',
                endrow: 1
            }                                                      
        ]            
    },        
    {
        type: "Unit",
        description: "return a list of all current units",
        sort: {created_date: 'desc'},
        editable: 1,        
        index:[
            {
                column_width: 15,
                column_name: "Name",
                value: ["name"],
                header: "Name",
                startrow: 1
            },
            {
                column_width: 5,
                column_name: "Cost",
                value: ["cost"],
                endrow: 1
            },
            {
                column_width: 5,
                column_name: "Shooting_Bonus",
                value: ["shooting_bonus"],
                header: "Stats",
                startrow: 1
            },
            {
                column_width: 5,
                column_name: "Fighting_Bonus",
                value: ["fighting_bonus"]
            },
            {
                column_width: 5,
                column_name: "Health",
                value: ["health"]
            },
            {
                column_width: 5,
                column_name: "Movement",
                value: ["movement"]
            },
            {
                column_width: 5,
                column_name: "Cohesion",
                value: ["cohesion"]
            },
            {
                column_width: 5,
                column_name: "Size",
                value: ["size"],
                endrow: 1
            },
            {
                column_width: 5,
                column_name: "Sprite_Offset",
                value: ['sprite_offset'],
                header: "Assets",
                startrow: 1
            },
            {
                column_width: 10,
                column_name: "Spritesheet",
                value: ["spritesheet"]
            },
            {
                column_width: 5,
                column_name: "Death-SFX",
                value: ["death_sfx"]
            },
            {
                column_width: 10,
                column_name: "Symbol_ID",
                value: ["symbol_id"],
                endrow: 1
            },

            {
                column_width: 10,
                column_name: "Created",
                value: ["created_date"],
                type: "date",
                header: "Dates",
                startrow: 1,
                readonly: 1
            },            
            {
                column_width: 10,
                column_name: "Updated",
                value: ["updateddate"],
                type: "date",
                endrow: 1,
                readonly: 1
            }                                                            
        ]         
    },       
    {
        type: "Gun",
        description: "return a list of all current guns",
        sort: {created_date: 'desc'},
        sub_data: ["Barrier"],
        editable: 1,        
        index:[
            {
                column_width: 10,
                column_name: "Name",
                value: ["name"],
                header: "Name",
                startrow: 1,
                endrow: 1
            },
            {
                column_width: 5,
                column_name: "Cost",
                value: ["cost"],
                header: "Stats",
                startrow: 1
            },
            {
                column_width: 5,
                column_name: "Range",
                value: ["range"]
            },
            {
                column_width: 10,
                column_name: "Damage",
                value: ["damage"]
            },
            {
                column_width: 10,
                column_name: "Amour_Piercing",
                value: ["ap"]
            },
            {
                column_width: 10,
                column_name: "Max_Targets",
                value: ["max_targets"]
            },
            {
                column_width: 10,
                column_name: "Blast_Radius",
                value: ["blast_radius"],
                endrow: 1,
            },
            {
                column_width: 10,
                column_name: "Blast_Spritesheet",
                value: ["blast_spritesheet"],
                header: "Assets",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 10,
                column_name: "Barrier",
                value: ['barrier','name'],
                header: "Barriers",
                sub_data: "Barrier",
                type: "select",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 10,
                column_name: "Created",
                value: ["created_date"],
                type: "date",
                header: "Dates",
                startrow: 1,
                readonly: 1,                
            },
            {
                column_width: 10,
                column_name: "Updated",
                value: ["updateddate"],
                type: "date",
                endrow: 1,
                readonly: 1,
            }                                                      
        ]         
    },
    {
        type: "Melee",
        description: "return a list of all current melee weapons",
        sort: {created_date: 'desc'},
        editable: 1,        
        index:[
            {
                column_width: 10,
                column_name: "Name",
                value: ["name"],
                header: "Name",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 10,
                column_name: "Cost",
                value: ["cost"],
                header: "Stats",
                startrow: 1
            },
            {
                column_width: 10,
                column_name: "Range",
                value: ["range"]
            },
            {
                column_width: 10,
                column_name: "Damage",
                value: ["damage"]
            },
            {
                column_width: 10,
                column_name: "Amour_Piercing",
                value: ["ap"]
            },
            {
                column_width: 10,
                column_name: "Max_Targets",
                value: ["max_targets"],
                endrow: 1
            },
            {
                column_width: 20,
                column_name: "Created",
                value: ["created_date"],
                type: "date",
                header: "Dates",
                startrow: 1,
                readonly: 1
            },
            {
                column_width: 20,
                column_name: "Updated",
                value: ["updateddate"],
                type: "date",
                endrow: 1,
                readonly: 1
            }                                                      
        ]         
    },
    {
        type: "Armour",
        description: "return a list of all current armour",
        sort: {created_date: 'desc'},
        editable: 1,        
        index:[
            {
                column_width: 20,
                column_name: "Name",
                value: ["name"],
                header: "Name",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 20,
                column_name: "Cost",
                value: ["cost"],
                header: "Stats",
                startrow: 1
            },
            {
                column_width: 20,
                column_name: "Value",
                value: ["value"],
                endrow: 1
            },
            {
                column_width: 20,
                column_name: "Created",
                value: ["created_date"],
                type: "date",
                header: "Dates",
                readonly: 1,
                startrow: 1
            },
            {
                column_width: 20,
                column_name: "Updated",
                value: ["updateddate"],
                type: "date",
                readonly: 1,
                endrow: 1
            }                                                      
        ]         
    },
    {
        type: "Upgrade",
        description: "return a list of all current upgrades",
        sort: {created_date: 'desc'},
        sub_data: ['Unit','Gun'],
        editable: 1,        
        index:[
            {
                column_width: 20,
                column_name: "Name",
                value: ["name"],
                header: "Name",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 30,
                column_name: "Description",
                value: ["description"],
                startrow: 1,
                endrow: 1,                
            },            
            {
                column_width: 10,
                column_name: "Cost",
                value: ["cost"],
                header: "Stats",
                startrow: 1,            
            },
            {
                column_width: 10,
                column_name: "Upgrade_All",
                value: ["upgrades_all_in_squad"],
                endrow: 1
            },
            {
                column_width: 15,
                column_name: "Unit",
                value: ["unit","name"],
                sub_data: 'Unit',
                type: "select",
                header: "Joins",
                startrow: 1
            },
            {
                column_width: 15,
                column_name: "Gun",
                value: ["gun","name"],
                sub_data: 'Gun',     
                type: "select",           
                endrow: 1
            }                                                        
        ]         
    },    
    {
        type: "Barrier",
        description: "return a list of all current barriers",
        sort: {created_date: 'desc'},
        editable: 1,        
        index:[
            {
                column_width: 10,
                column_name: "Name",
                value: ["name"],
                header: "Name",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 20,
                column_name: "Descripion",
                value: ["description"],
                type: "textarea",
                startrow: 1,
                endrow: 1,                
            },
            {
                column_width: 10,
                column_name: "Life",
                value: ["life"],
                header: "Stats",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 10,
                column_name: "Effects",
                value: ["effects"],
                startrow: 1,
                endrow: 1,                
            },            
            {
                column_width: 10,
                column_name: "Blast_Radius",
                value: ["blast_radius"],
                header: "Assets",
                startrow: 1
            },
            {
                column_width: 10,
                column_name: "Blast_Sprite",
                value: ["blast_sprite"],
                endrow: 1
            },
            {
                column_width: 15,
                column_name: "Created",
                value: ["created_date"],
                type: "date",
                header: "Dates",
                startrow: 1,
                readonly: 1,
            },
            {
                column_width: 15,
                column_name: "Updated",
                value: ["updateddate"],
                type: "date",
                endrow: 1,
                readonly: 1,                
            }                                                      
        ]         
    },
    {
        type: "SpecialRule",
        description: "return a list of all current special rules",
        sort: {created_date: 'desc'},
        editable: 1,        
        index:[
            {
                column_width: 10,
                column_name: "Name",
                value: ["name"],
                header: "Name",
                startrow: 1,
                endrow: 1,
            },
            {
                column_width: 20,
                column_name: "Descripion",
                value: ["description"],
                startrow: 1,
                endrow: 1,
                type: "textarea"                
            },                                                  
        ]         
    },    
    ]