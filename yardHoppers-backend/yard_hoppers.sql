\echo 'Delete and recreate yard_hoppers db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE yard_hoppers;
CREATE DATABASE yard_hoppers;
\connect yard_hoppers

\i yard_hoppers-schema.sql
\i yard_hoppers-seed.sql

\echo 'Delete and recreate yard_hoppers_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE yard_hoppers_test;
CREATE DATABASE yard_hoppers_test;
\connect yard_hoppers_test

\i yard_hoppers-schema.sql
