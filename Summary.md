# Overview

The goal of my project was to create a flexible backend to allow for analyzing the data, and a frontend component to display the data.

# Running the Project

If you have the .NET SDK and Yarn installed locally, you can start the components in three different shells with:


```
$ cd api
$ dotnet watch run
```

```
$ cd backend
$ npm start
```

```
$ cd frontend
$ yarn install
$ yarn start
```

The frontend will be available at `http://localhost:3000/` and the GraphQL Server will be available at ``http://localhost:4000/`

# Backend

I left the dotnet api in place to continue serving the data on a local url, but as I am less familiar with dotnet specifically I did not do anything else with it.

I set up an Apollo GraphQL server and client, to allow for searching and analysis of the data. After creating some resolvers, the server supports queries for all members, a specific member given the district, and for all members of a committee given the committee code (sample queries are at the bottom).


# Frontend

The frontend contains two main pages - a page with a table of member information, and a page with a graph showing the committee relationships between different members.

The table is searchable, which is intentionally case sensitive - this way a search for MA turns up results for members from Massachussets without also turning up people named Mary, and a search for Ma turns up people named Mary without also turning up someone with "ma" as part of their name.

I also used React Router to dynamically create pages for each member. Clicking a link in the table takes you to a page with expanded information about that member.

The graph shows the members as nodes, with a link between two nodes reflecting that they both serve on the same committee (subcommittees are not included, as two people on the same subcommittee are by definition on the same committee). The member names are visible by hovering over a node, and hovering over a link shows you the committee code.

# To-Do

If I had more time, I would have added sorting and pagination to the Member Information table, as well as giving users the ability to select which fields are and aren't part of the table. I have done this before, but because I am still newer to React it takes me longer than I had time for on this project. I would also have made the Member Information pages prettier (for example aligning the committee and subcommittee tables). I would also have added enhancements to the graph, possibly utilizing the committee query and resolver, which I made with the original intention of using them for the graph but then it didn't make sense to utilize when I was implementing the graph.

A backend expansion I thought of but did not have time for was to have a local datastore and sourcing query results from there, so that updates could be made to the data and be reflected in the frontend.

# Sample Queries

A query for all members

```
query MemberQuery {
  members {
    stateDistrict
    memberInfo {
      nameList
      bioGuideID
      firstName
      lastName
      fullName
      middleName
      sortName
      officialName
      formalName
      suffix
      courtesy
      priorCongress
      party
      caucus
      state {
        postalCode
        stateFullName
      }
      district
      townName
      officeBuilding
      officeRoom
      officeZip
      officeZipSuffix
      phone
      electedDate {
        date
        text
      }
      swornDate {
        date
        text
      }
      committeeAssignments {
        committee {
          comCode
          rank
          leadership
        }
        subcommittee {
          subcomCode
          rank
          leadership
        }
      }
    }
  }
}
```

A query for all members belonging to a certain committee (or subcommittee)

```
query CommitteeQuery {
  committee (code: "II00") {
    stateDistrict
    memberInfo {
      nameList
      bioGuideID
      firstName
      lastName
      fullName
      middleName
      sortName
      officialName
      formalName
      suffix
      courtesy
      priorCongress
      party
      caucus
      state {
        postalCode
        stateFullName
      }
      district
      townName
      officeBuilding
      officeRoom
      officeZip
      officeZipSuffix
      phone
      electedDate {
        date
        text
      }
      swornDate {
        date
        text
      }
      committeeAssignments {
        committee {
          comCode
          rank
          leadership
        }
        subcommittee {
          subcomCode
          rank
          leadership
        }
      }
    }
}
}
```

A query for the member of a certain district

```
query CommitteeQuery {
  member (stateDistrict: "VA08") {
    stateDistrict
    memberInfo {
      nameList
      bioGuideID
      firstName
      lastName
      fullName
      middleName
      sortName
      officialName
      formalName
      suffix
      courtesy
      priorCongress
      party
      caucus
      state {
        postalCode
        stateFullName
      }
      district
      townName
      officeBuilding
      officeRoom
      officeZip
      officeZipSuffix
      phone
      electedDate {
        date
        text
      }
      swornDate {
        date
        text
      }
      committeeAssignments {
        committee {
          comCode
          rank
          leadership
        }
        subcommittee {
          subcomCode
          rank
          leadership
        }
      }
    }
}
}
```



