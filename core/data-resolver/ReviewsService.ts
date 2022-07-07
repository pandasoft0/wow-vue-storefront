import { DataResolver } from './types/DataResolver';
import { TaskQueue } from '@vue-storefront/core/lib/sync'
import {processLocalizedURLAddress, processURLAddress} from '@vue-storefront/core/helpers'
import config from 'config'
import Review from 'core/modules/review/types/Review';
import getApiEndpointUrl from '@vue-storefront/core/helpers/getApiEndpointUrl';
import Task from "core/lib/sync/types/Task";

const createReview = (review: Review): Promise<boolean> =>
  TaskQueue.execute({
    url: processLocalizedURLAddress(getApiEndpointUrl(config.reviews, 'create_endpoint')),
    payload: {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ review })
    }
  }).then(({ code }) => code === 200)


const listReview = async (productId: number) =>
  TaskQueue.execute({
    url: processURLAddress(`${getApiEndpointUrl(config.reviews, 'lists_endpoint')}?productId=${encodeURIComponent(productId)}`),
    payload: {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    },
    productId: productId
  })

export const ReviewsService: DataResolver.ReviewsService = {
  createReview,
  listReview
}
