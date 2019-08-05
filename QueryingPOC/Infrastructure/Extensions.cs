
using System;
using System.Collections;

namespace QueryingPOC.Infrastructure
{

    public static class Extensions
    {
        public static IList Shuffle(this IList source)
        {
            for (int i = source.Count - 1; i > 0; i--)
            {
                var rand = new Random().Next(0, i);
                var temp = source[rand];
                source[rand] = source[i];
                source[i] = temp;
            }

            return source;
        }
    }

}