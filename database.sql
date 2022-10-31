create table week_days(
    id serial primary key,
    days_of_week VARCHAR(15) NOT NULL
);

create table names(
    id serial primary key,
    named VARCHAR(15) NOT NULL,
    Code text not null   

);


create table waiter_days(
    id serial primary key,
    days_id integer not null,
    waiter_names_id integer not null,
    foreign key (days_id) references week_days(id),
    foreign key ( waiter_names_id) references names(id)
);

insert into week_days (days_of_week) values ('Sunday'), ('Monday'), ('Tuesday'),
('Wednesday'), ('Thursday'), ('Friday'), ('Saturday')
;
