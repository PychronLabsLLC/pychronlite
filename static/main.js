
// do initialiation
$(document).ready(function (){
    initialization()


})

function doCalculations(){
    let url = '/doCalculations'
    var dt = $('#analysestable').DataTable()
    // console.log(dt.rows().data())

    fetch(url,
        {method: 'POST',
             headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'},
             body: JSON.stringify(dt.rows().data())}
        ).then(response=> response.json()).then(data=>{
        console.log('docalculations response', data)

        var resultstable = $('#resultstable')
        var resultsdt = resultstable.DataTable({
                // data: dataset,
                data: data['results'],
                columns: [{data: 'sample'},
                            {data: 'age'},
                            {data: 'ageerr'},
                            ]
                });

    })

}

function initialization(){

    var dataset = [{runid: '1000-01',
    sample: 'bar',
    project: 'moo',
        ar40: 10,
        ar39: 10,
        ar38: 0.0001,
        ar37: 0.0001,
        ar36: 0.0003,
        ar40err: 0.00001,
        ar39err: 0.00001,
        ar38err: 0.00001,
        ar37err: 0.00001,
        ar36err: 0.00001,
    }]
    var analysestable = $('#analysestable')
    var analysesdt = analysestable.DataTable({
                data: dataset,
                columns: [{data: 'runid',
                            label: 'RunID'},
                            {data: 'sample'},
                            {data: 'project'},
                            {data: 'ar40'},
                            {data: 'ar40err'},
                            {data: 'ar39'},
                            {data: 'ar39err'},
                            {data: 'ar38'},
                            {data: 'ar38err'},
                            {data: 'ar37'},
                            {data: 'ar37err'},
                            {data: 'ar36'},
                            {data: 'ar36err'},
                            ]
                });

    // calculate_ages(dataset)


}
//
// function make_age(d){
//     age, ageerr = calculate_age(d)
//     return {age: age, ageerr: ageerr, sample: d.sample}
// }
//
// function calculate_age(d){
//
//
//
// }
//
//
// function calculate_ages(dataset){
//
//     let ds = dataset.map(
//         d=>{
//             return make_age(d)
//         }
//     )
//
//
//     var resultstable = $('#resultstable')
//     var resultsdt = resultstable.DataTable({
//                 // data: dataset,
//                 data: ds,
//                 columns: [{data: 'sample'},
//                             {data: 'age'},
//                             {data: 'ageerr'},
//                             ]
//                 });
//
//
//
// }