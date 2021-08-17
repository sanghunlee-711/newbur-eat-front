import { useQuery, useSubscription } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryZoomContainer,
} from 'victory';
import { Dish } from '../../components/dish';
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from '../../fragments';
import {
  myRestaurant,
  myRestaurantVariables,
} from '../../__generated__/myRestaurant';
import { pendingOrders } from '../../__generated__/pendingOrders';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

interface IParams {
  id: string;
}

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();

  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );
  const { data: subsciprtionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  const history = useHistory();

  useEffect(() => {
    if (subsciprtionData?.pendingOrders.id) {
      history.push(`/orders/${subsciprtionData.pendingOrders.id}`);
    }
  }, [subsciprtionData]);

  return (
    <div>
      <div
        className=" bg-gray-700 py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading ...'}
        </h2>
        <Link
          to={`/restaurants/${id}/add-dish`}
          className=" mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <Link to="" className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish, index) => (
                <Dish
                  key={index}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className=" mx-auto mb-10">
            <VictoryChart
              theme={VictoryTheme.material}
              height={500}
              domainPadding={50}
              width={window.innerWidth}
              containerComponent={<VictoryZoomContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 12 }}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    stroke: 'gray',
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                style={{ tickLabels: { fontSize: 15, fill: '#4d7c0f' } }}
                dependentAxis
                tickFormat={(tick) => `$${tick}`}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: { fontSize: 10, fill: '#4d7c0f', angle: 45 },
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString('ko')}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
