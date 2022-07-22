# ===============================================================================
# Copyright 2022 ross
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ===============================================================================
from itertools import groupby
from operator import attrgetter, itemgetter

from numpy import asarray, average
from uncertainties import nominal_value, std_dev, ufloat

from argon_calculations import ArArConstants, calculate_arar_decay_factors, age_equation, calculate_f

arar_constants = ArArConstants()


def calculate_age(an):
    dc37 = nominal_value(arar_constants.lambda_Ar37)
    dc39 = nominal_value(arar_constants.lambda_Ar39)

    decay_days = 10
    # pi, ti, ti_p, _, _
    a, b = calculate_arar_decay_factors(
        dc37, dc39, [(1, 1, decay_days, None, None)]
    )

    decay_factor_37, decay_factor_39 = float(a), float(b)

    an['ar37_corrected'] = an['ar37'] * decay_factor_37
    an['ar39_corrected'] = an['ar39'] * decay_factor_39
    isos = (
        ufloat(an[attr], 0)
        for attr in ("ar40", "ar39_corrected", "ar38", "ar37_corrected", "ar36")
    )

    f, f_wo_irrad, non_ar_isotopes, computed, interference_corrected = calculate_f(
        isos, decay_days
    )
    uage = age_equation(ufloat(an['j'], an['jerr']), f)

    return nominal_value(uage), std_dev(uage), computed


def calculate_weighted_mean(x, errs):
    x = asarray(x)
    errs = asarray(errs)

    idx = errs.astype(bool)

    errs = errs[idx]
    x = x[idx]

    weights = 1 / errs ** 2
    try:
        wmean, sum_weights = average(x, weights=weights, returned=True)
        werr = sum_weights ** -0.5
    except ZeroDivisionError:
        wmean = average(x)
        werr = 0

    return wmean, werr


def percent_err(v, e):
    return f'{e / v * 100:0.2f}'


def make_means(results):
    means = []
    for sample, ans in groupby(sorted(results, key=itemgetter('sample')), key=itemgetter('sample')):
        ans = [(float(x['age']), float(x['ageerr'])) for x in ans]
        m, e = calculate_weighted_mean(*zip(*ans))
        means.append({'sample': sample,
                      'mean': f'{m:0.4f}', 'mean_err': f'{e:0.4f}',
                      'mean_err_percent': percent_err(m, e)})
    return means


def make_results(dataobj):
    results = []
    records = [v for k, v in dataobj.items() if k.isdigit()]
    for sample, ans in groupby(sorted(records, key=itemgetter('sample')), key=itemgetter('sample')):
        for a in ans:
            age, ageerr, computed = calculate_age(a)
            rad40 = computed['radiogenic_yield']
            results.append({'sample': sample, 'age': f'{age:0.4f}',
                            'ageerr': f'{ageerr:0.4f}',
                            'ageerr_percent': percent_err(age, ageerr),
                            'radiogenic_yield': f'{nominal_value(rad40):0.2f}'})
    return results

# ============= EOF =============================================
