module Game where

import 

data Direction =
    Up
    | Down

data Tile =
    Space
    | Desk
    | Wall
    | Door
    | Stairs Direction
    | Bookcase


