# CGKB [![npm version](https://badge.fury.io/js/cgkb.svg)](https://badge.fury.io/js/cgkb) [![CircleCI](https://circleci.com/gh/kengz/CGKB.svg?style=shield)](https://circleci.com/gh/kengz/CGKB) [![Code Climate](https://codeclimate.com/github/kengz/CGKB/badges/gpa.svg)](https://codeclimate.com/github/kengz/CGKB) [![Test Coverage](https://codeclimate.com/github/kengz/CGKB/badges/coverage.svg)](https://codeclimate.com/github/kengz/CGKB/coverage)

Contextual Graph Knowledge Base, basically a graph brain for my bot, based off [this crap](http://kengz.me/aiva/#contextual-graph-knowledge-base) *This is still a work in progress.*

## Installation

```shell
# install spacy in python3
python3 -m pip install -U socketIO-client
python3 -m pip install -U spacy
python3 -m spacy.en.download

# neo4j db, google it. Start your neo4j db first

# install this npm package
npm i --save cgkb
# or run
./node_modules/cgkb/bin/setup
```