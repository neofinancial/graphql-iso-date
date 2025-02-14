// @flow
/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GraphQLScalarType, Kind } from 'graphql'
import type {GraphQLScalarTypeConfig} from "graphql";// eslint-disable-line
import { validateDate, validateJSDate, serializeDate, parseDate } from '../utils'

/**
 * An RFC 3339 compliant date scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 date string as input and
 *    parses it to a javascript Date.
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 date strings to RFC 3339 date strings.
 */
const config: GraphQLScalarTypeConfig<Date, string> = {
  name: 'Date',
  description: 'A date string, such as 2007-12-03, compliant with the `full-date` ' +
               'format outlined in section 5.6 of the RFC 3339 profile of the ' +
               'ISO 8601 standard for representation of dates and times using ' +
               'the Gregorian calendar.',
  serialize (value) {
    if (value instanceof Date) {
      if (validateJSDate(value)) {
        return serializeDate(value)
      }
      throw new TypeError('Date cannot represent an invalid Date instance')
    } else if (typeof value === 'string' || value instanceof String) {
      if (validateDate(value)) {
        return value
      }
      throw new TypeError(
        `Date cannot represent an invalid date-string ${value}.`
      )
    } else {
      throw new TypeError(
        'Date cannot represent a non string, or non Date type ' +
          JSON.stringify(value)
      )
    }
  },
  parseValue (value) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError(
        `Date cannot represent non string type ${JSON.stringify(value)}`
      )
    }
    const trimmedValue = value.split('T')[0]
    if (validateDate(trimmedValue)) {
      return parseDate(trimmedValue)
    }
    throw new TypeError(
      `Date cannot represent an invalid date-string ${value}.`
    )
  },
  parseLiteral (ast) {
    if (ast.kind !== Kind.STRING) {
      throw new TypeError(
        `Date cannot represent non string type ${String(ast.value != null ? ast.value : null)}`
      )
    }
    const { value } = ast
    const trimmedValue = value.split('T')[0]
    if (validateDate(trimmedValue)) {
      return parseDate(trimmedValue)
    }
    throw new TypeError(
      `Date cannot represent an invalid date-string ${String(value)}.`
    )
  }
}

export default new GraphQLScalarType(config)
